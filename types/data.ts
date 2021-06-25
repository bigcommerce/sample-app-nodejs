export interface ContextValues {
  storeHash: string;
  setStoreHash: (key: string) => void;
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
