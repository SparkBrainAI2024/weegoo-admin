import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client/react";
// routing
import router from 'routes';

// project imports
import Locales from 'components/ui-component/Locales';
import NavigationScroll from 'components/layout/NavigationScroll';
import RTLLayout from 'components/ui-component/RTLLayout';
import Snackbar from 'components/ui-component/extended/Snackbar';
import Notistack from 'components/ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import client from 'lib/apolloClient';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => {
    return (
       <ApolloProvider client={client}>
         <ThemeCustomization>
            <RTLLayout>
                <Locales>
                    <NavigationScroll>
                        <AuthProvider>
                            <>
                                <Notistack>
                                    <RouterProvider router={router} />
                                    <Snackbar />
                                </Notistack>
                            </>
                        </AuthProvider>
                    </NavigationScroll>
                </Locales>
            </RTLLayout>
        </ThemeCustomization>
        </ApolloProvider>
    );
};

export default App;
