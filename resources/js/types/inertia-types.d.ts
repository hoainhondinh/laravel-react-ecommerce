declare module '@inertiajs/react' {
  // Types for useForm
  export interface UseFormOptions {
    onFinish?: (page: any) => void;
    onProgress?: (progress: any) => void;
    onSuccess?: (page: any) => void;
    onError?: (errors: Record<string, string>) => void;
    preserveScroll?: boolean;
    preserveState?: boolean | ((page: any) => boolean);
    resetOnSuccess?: boolean;
    forceFormData?: boolean;
  }

  export function useForm<TForm extends Record<string, any>>(
    initialValues: TForm
  ): {
    data: TForm;
    setData: (<K extends keyof TForm>(
      key: K,
      value: TForm[K] | ((prev: TForm[K]) => TForm[K])
    ) => void) & ((values: Partial<TForm>) => void);
    errors: Partial<Record<keyof TForm, string>>;
    hasErrors: boolean;
    processing: boolean;
    progress: number | null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    isDirty: boolean;
    transform: (callback: (data: TForm) => Record<string, any>) => void;
    setDefaults: () => void;
    setDefaults: (field: keyof TForm, value: TForm[keyof TForm]) => void;
    setDefaults: (fields: Partial<TForm>) => void;
    reset: (...fields: (keyof TForm)[]) => void;
    clearErrors: (...fields: (keyof TForm)[]) => void;
    setError: (field: keyof TForm, value: string) => void;
    setError: (errors: Record<keyof TForm, string>) => void;
    submit: (method: string, url: string, options?: UseFormOptions) => void;
    get: (url: string, options?: UseFormOptions) => void;
    patch: (url: string, options?: UseFormOptions) => void;
    post: (url: string, options?: UseFormOptions) => void;
    put: (url: string, options?: UseFormOptions) => void;
    delete: (url: string, options?: UseFormOptions) => void;
  };

  // Other Inertia exports
  export function Head(props: {
    title?: string;
    children?: React.ReactNode;
  }): JSX.Element;

  export interface LinkProps {
    as?: string;
    data?: object;
    href: string;
    method?: string;
    headers?: object;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    preserveScroll?: boolean | ((props: object) => boolean);
    preserveState?: boolean | ((props: object) => boolean) | null;
    replace?: boolean;
    only?: string[];
    onCancelToken?: (cancelToken: object) => void;
    onBefore?: () => void;
    onStart?: () => void;
    onProgress?: (progress: { percentage: number }) => void;
    onFinish?: () => void;
    onCancel?: () => void;
    onSuccess?: (page: object) => void | boolean;
    onError?: (errors: object) => void;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export function Link(props: LinkProps): JSX.Element;

  // Add InertiaLinkProps for compatibility with old code
  export type InertiaLinkProps = LinkProps;

  export const router: {
    visit: (
      url: string,
      options?: {
        method?: string;
        data?: object;
        replace?: boolean;
        preserveState?: boolean;
        preserveScroll?: boolean;
        only?: string[];
        headers?: object;
        onCancelToken?: (cancelToken: object) => void;
        onBefore?: () => void;
        onStart?: () => void;
        onProgress?: (progress: { percentage: number }) => void;
        onFinish?: () => void;
        onCancel?: () => void;
        onSuccess?: (page: object) => void;
        onError?: (errors: object) => void;
      }
    ) => void;
    reload: (options?: {
      method?: string;
      data?: object;
      preserveState?: boolean;
      preserveScroll?: boolean;
      only?: string[];
    }) => void;
    [key: string]: any;
  };

  export function usePage<T = any>(): T & {
    props: any;
  };

  // Add createInertiaApp definition
  export interface InertiaAppOptions {
    page?: any;
    render?: (component: React.ReactElement) => string;
    title?: (title: string) => string;
    resolve?: (name: string) => Promise<any>;
    setup: (options: {
      el: HTMLElement;
      App: React.ComponentType<any>;
      props: Record<string, any>;
    }) => void;
    progress?: {
      color?: string;
      includeCSS?: boolean;
      showSpinner?: boolean;
    };
  }

  export function createInertiaApp(options: InertiaAppOptions): Promise<any>;
}
