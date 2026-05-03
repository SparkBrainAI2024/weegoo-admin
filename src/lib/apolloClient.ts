import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from "@apollo/client";

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("serviceToken");
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
              localStorage.removeItem("serviceToken");
              window.location.href = "/login";
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
    new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL  }),
  ]),
  cache: new InMemoryCache(),
});

export default client;