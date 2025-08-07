import { type AppType } from "next/app";

import { api } from "~/utils/api";
import Footer from "~/components/footer";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default api.withTRPC(MyApp);
