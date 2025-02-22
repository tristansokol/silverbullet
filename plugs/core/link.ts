import { nodeAtPos } from "$sb/lib/tree.ts";
import { editor, markdown, system } from "$sb/silverbullet-syscall/mod.ts";
import { events } from "$sb/plugos-syscall/mod.ts";

type UnfurlOption = {
  id: string;
  name: string;
};

export async function unfurlCommand() {
  const mdTree = await markdown.parseMarkdown(await editor.getText());
  const nakedUrlNode = nodeAtPos(mdTree, await editor.getCursor());
  const url = nakedUrlNode!.children![0].text!;
  console.log("Got URL to unfurl", url);
  const optionResponses = await events.dispatchEvent("unfurl:options", url);
  const options: UnfurlOption[] = [];
  for (const resp of optionResponses) {
    options.push(...resp);
  }
  const selectedUnfurl: any = await editor.filterBox(
    "Unfurl",
    options,
    "Select the unfurl strategy of your choice",
  );
  if (!selectedUnfurl) {
    return;
  }
  try {
    const replacement = await system.invokeFunction(
      "server",
      "unfurlExec",
      selectedUnfurl.id,
      url,
    );
    await editor.replaceRange(
      nakedUrlNode?.from!,
      nakedUrlNode?.to!,
      replacement,
    );
  } catch (e: any) {
    await editor.flashNotification(e.message, "error");
  }
}

export function titleUnfurlOptions(): UnfurlOption[] {
  return [
    {
      id: "title-unfurl",
      name: "Extract title",
    },
  ];
}

// Run on the server because plugs will likely rely on fetch for this
export async function unfurlExec(id: string, url: string): Promise<string> {
  const replacement = await events.dispatchEvent(`unfurl:${id}`, url);
  if (replacement.length === 0) {
    throw new Error("Unfurl failed");
  } else {
    return replacement[0];
  }
}

const titleRegex = /<title[^>]*>\s*([^<]+)\s*<\/title\s*>/i;

export async function titleUnfurl(url: string): Promise<string> {
  const response = await fetch(url);
  if (response.status < 200 || response.status >= 300) {
    console.error("Unfurl failed", await response.text());
    throw new Error(`Failed to fetch: ${await response.statusText}`);
  }
  const body = await response.text();
  const match = titleRegex.exec(body);
  if (match) {
    return `[${match[1]}](${url})`;
  } else {
    throw new Error("No title found");
  }
}
