export type PrintableWindow = Pick<Window, "print">;

export function printCurrentPage(targetWindow: PrintableWindow = window): void {
  targetWindow.print();
}
