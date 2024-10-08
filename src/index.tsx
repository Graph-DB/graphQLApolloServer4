import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  makeVar,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

export const starredVar = makeVar([]);

const AppWithApollo = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const httpLink = createHttpLink({
    //uri: "http://localhost:4000"
    uri: process.env.REACT_APP_QRAPHQL_URI
  })

  const authLink = setContext(async (_, { headers }) => {
    // only try to fetch access token if user is authenticated
    const accessToken = isAuthenticated ? await getAccessTokenSilently() : undefined
    if (accessToken) {
      //console.log("accessToken: " + accessToken)
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}`:""
        }
      }
    } else {
      return {
        headers: {
          ...headers
        }
      }
    }
  })

  const client = new ApolloClient({
    //uri: "http://localhost:4000",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Business: {
          fields: {
            isStarred: {
              read(_, { readField }) {
                return starredVar().includes(readField("businessId") as never);
              },
            },
          },
        },
      },
    }),
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <AppWithApollo />
      {/*<ApolloProvider client={client}>
        <App />
      </ApolloProvider>
      */}
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
