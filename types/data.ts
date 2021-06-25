export interface ContextValues {
  context: string;
  setContext: (key: string) => void;
}

export interface FormData {
    description: string;
    isVisible: boolean;
    name: string;
    price: number;
    type: string;
}

export interface StringKeyValue {
    [key: string]: string;
}
