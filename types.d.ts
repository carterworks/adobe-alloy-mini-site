export interface APIPersonalization {
  selector: string;
  html: string;
  css: string;
  type: "replaceHtml" | "prependHtml" | "appendHtml" | "popup";
}

export interface AlloyEvent {
  eventName: "click" | "view" | "personalization:display";
  eventProperties: Record<string, unknown>;
}
