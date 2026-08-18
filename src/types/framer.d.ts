declare module "framer" {
  export function addPropertyControls(component: any, controls: any): void;
  export const ControlType: {
    String: string;
    Color: string;
    Number: string;
    Boolean: string;
    Enum: string;
    Array: string;
    Object: string;
    File: string;
    Image: string;
    ComponentInstance: string;
    Transition: string;
    EventHandler: string;
  };
}
