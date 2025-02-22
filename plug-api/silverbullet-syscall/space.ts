import { syscall } from "./syscall.ts";
import { AttachmentMeta, PageMeta } from "../../common/types.ts";

export function listPages(unfiltered = false): Promise<PageMeta[]> {
  return syscall("space.listPages", unfiltered);
}

export function getPageMeta(name: string): Promise<PageMeta> {
  return syscall("space.getPageMeta", name);
}

export function readPage(
  name: string,
): Promise<string> {
  return syscall("space.readPage", name);
}

export function writePage(name: string, text: string): Promise<PageMeta> {
  return syscall("space.writePage", name, text);
}

export function deletePage(name: string): Promise<void> {
  return syscall("space.deletePage", name);
}

export function listPlugs(): Promise<string[]> {
  return syscall("space.listPlugs");
}

export function listAttachments(): Promise<PageMeta[]> {
  return syscall("space.listAttachments");
}

export function getAttachmentMeta(name: string): Promise<AttachmentMeta> {
  return syscall("space.getAttachmentMeta", name);
}

/**
 * Read an attachment from the space
 * @param name path of the attachment to read
 * @returns the attachment data encoded as a data URL
 */
export function readAttachment(
  name: string,
): Promise<string> {
  return syscall("space.readAttachment", name);
}

/**
 * Writes an attachment to the space
 * @param name path of the attachment to write
 * @param encoding encoding of the data ("string" or "dataurl)
 * @param data data itself
 * @returns
 */
export function writeAttachment(
  name: string,
  encoding: "string" | "dataurl",
  data: string,
): Promise<AttachmentMeta> {
  return syscall("space.writeAttachment", name, encoding, data);
}

/**
 * Deletes an attachment from the space
 * @param name path of the attachment to delete
 */
export function deleteAttachment(name: string): Promise<void> {
  return syscall("space.deleteAttachment", name);
}
