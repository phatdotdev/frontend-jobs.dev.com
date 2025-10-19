export type ResponseProps<T> = {
  success: boolean;
  message: string;
  data: T;
};
