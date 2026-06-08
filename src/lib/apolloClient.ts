import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from "@apollo/client";
import { ROUTES } from "constants/routes";
import LocalStorageService from "services/localStorage.service";

const authLink = new ApolloLink((operation, forward) => {
  const token = LocalStorageService.get("serviceToken");
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      lang: "EN",
    },
  });
  return forward(operation);
});

const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (response) => {
        if (response?.errors) {
          response.errors.forEach((err) => {
            if ((err.extensions as any)?.statusCode === 401) {
              if (window.location.pathname !== ROUTES.LOGIN) {
                LocalStorageService.remove("serviceToken");
                window.location.href = ROUTES.LOGIN;
              }
            }
          });
        }
        observer.next(response);
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
    return () => sub.unsubscribe();
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  ]),
  cache: new InMemoryCache(),
});

export default client;