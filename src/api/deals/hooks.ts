import { useState, useMemo, useCallback, useEffect, createContext, useContext } from 'react';

import useDebounced from '../../hooks/useDebounced';

import { Exception } from '../fetcher';

import { injectLead, EmailSchema, NameSchema, PhoneNumberSchema, URLSchema } from './actions';

import { LeadInjectionResponse } from './types';

export function useValidatedLeadInjectionValues(
  email: string,
  name: string,
  phone: string,
  url: string
): {
  email: string | null;
  name: string | null;
  phone: string | null;
  url: string | null;
} {
  const [validEmail, setValidEmail] = useState<string | null>(null);
  const [validName, setValidName] = useState<string | null>(null);
  const [validPhone, setValidPhone] = useState<string | null>(null);
  const [validUrl, setValidUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const valiatedEmail = await EmailSchema.validate(email);

        if (cancelled) return;

        setValidEmail(valiatedEmail);
      } catch (e) {
        setValidEmail(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const validatedName = await NameSchema.validate(name);

        if (cancelled) return;

        setValidName(validatedName);
      } catch (e) {
        setValidName(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const validatedPhone = await PhoneNumberSchema.validate(phone);

        if (cancelled) return;

        setValidPhone(validatedPhone);
      } catch (e) {
        setValidPhone(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phone]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const validatedUrl = await URLSchema.validate(url);

        if (cancelled) return;

        setValidUrl(validatedUrl);
      } catch (e) {
        setValidUrl(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return useMemo(
    () => ({ email: validEmail, name: validName, phone: validPhone, url: validUrl }),
    [validEmail, validName, validPhone, validUrl]
  );
}

export function useInjectLead(
  routingId: string,
  productId?: string,
  onError?: (e: Exception) => void
) {
  const [data, setData] = useState<LeadInjectionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // true when inject is called, false when inject is done
  const [isLoading, setIsLoading] = useState(false); // true when inject is loading, false when inject is done

  // This is used to show the questions. We only want to show the questions once the user has entered their email, name, phone, and URL, and the round trip to the server is done.
  // This is meant to give the Enrichment API time to run before showing the questions.
  const [calledWithAllData, setCalledWithAllData] = useState(false);

  const handleException = (e: unknown) => {
    if (e instanceof Exception) {
      if (e.response.statusCode < 500) return; // Suppress bad request errors. Only show server errors.

      onError?.(e);
      return;
    }

    throw e;
  };

  // Debounced functions use same logic as those using useEffectEvent. This means the object reference stays the same, even if dependencies change.
  const handler = useDebounced(
    async (params: { email?: string; name?: string; phone?: string; url?: string }) => {
      if (params.email) {
        try {
          setIsLoading(true);

          const resp = await injectLead({
            ...params,
            email: params.email,
            routingId,
            productId,
          });

          setData(resp);

          if (params.name && params.phone && params.url) {
            setCalledWithAllData(true);
          }
        } catch (e) {
          handleException(e);
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }

      setIsProcessing(false);
    },
    2000
  );

  const flush = useCallback(() => {
    handler.flush();
  }, [handler]);

  const cancel = useCallback(() => {
    handler.cancel();
  }, [handler]);

  const inject = useCallback(
    async (params: { email?: string; name?: string; phone?: string; url?: string }) => {
      setIsProcessing(true);

      try {
        await handler(params);
      } catch (e) {
        console.error(e);
      }
    },
    [handler]
  );

  return useMemo(
    () => ({ data, isProcessing, isLoading, calledWithAllData, inject, flush, cancel }),
    [data, isProcessing, isLoading, calledWithAllData, inject, flush, cancel]
  );
}

export const InjectLeadContext = createContext<ReturnType<typeof useInjectLead> | null>(null);

export const useInjectLeadContext = () => {
  const context = useContext(InjectLeadContext);

  if (!context) {
    throw new Error('useInjectLeadContext must be used within a InjectLeadProvider');
  }

  return context;
};
