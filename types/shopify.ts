export interface Product {
  availableForSale: boolean;
  createdAt: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  hasNextPage?: { value: boolean } | boolean;
  hasPreviousPage?: { value: boolean } | boolean;
  id: string;
  images: any[]; // Replace 'any' with a more specific type if available
  nextPageQueryAndPath?: Function; // Optional, as it might not always be present
  onlineStoreUrl: string | null;
  options: any[]; // Replace 'any' with a more specific type if available
  productType: string;
  publishedAt: string;
  refetchQuery?: Function; // Optional, as it might not always be present
  title: string;
  type?: {
    fieldBaseTypes: Record<string, any>; // Replace 'any' with a more specific type if available
    implementsNode: boolean;
    kind: string;
    name: string;
  };
  updatedAt: string;
  variableValues?: Record<string, any>; // Replace 'any' with a more specific type if available
  variants: any[]; // Replace 'any' with a more specific type if available
  vendor: string;
}