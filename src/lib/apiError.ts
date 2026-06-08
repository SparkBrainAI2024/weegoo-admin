export const handleErrors = (error: any, setErrorCallback: (errors: any) => void, showToast?: (msg: string) => void) => {
    const graphQLErrors = error?.graphQLErrors ?? error?.errors;

    if (graphQLErrors?.length > 0) {
        console.log('showToast', showToast);
        showToast?.(graphQLErrors[0].message);

        return;
    }

    // RTK Query style → inline
    if (error?.error?.data) {
        if (Array.isArray(error.error.data.errors)) {
            const errorObject: any = {};
            error.error.data.errors.forEach((e: any) => {
                errorObject[e.path] = e.msg;
            });
            setErrorCallback(errorObject);
        } else if (error.error.data.message) {
            setErrorCallback({ general: error.error.data.message });
        }
    }
};