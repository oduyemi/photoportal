"use client";
import { useRouter, usePathname } from "next/navigation";
import { ChakraProvider, Box } from "@chakra-ui/react";
import "./globals.css";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "@/navigation/Header";
import { Footer } from "@/navigation/Footer";
import Head from "next/head";
import Script from "next/script";
import { UserProvider, useUser } from "@/context/UserContext";
import { useEffect } from "react";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <html lang="en">
      <Head>
        <title>LinkOrg Photos</title>
        <meta name="description" content="Photo repository for staff of LinkOrg Networks LTD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </Head>
      <body style={{ margin: 0, padding: 0 }}>
        <UserProvider>
          <ChakraProvider>
            <Box minH="100vh" display="flex" flexDirection="column" m={0} p={0}>
              {isAdminRoute ? children : <ClientSideLayout>{children}</ClientSideLayout>}
            </Box>
          </ChakraProvider>
        </UserProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

const ClientSideLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = ["/", "/get-started", "/verify"];
    const isPublic = publicRoutes.includes(pathname);

    if (!loading && !user && !isPublic) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) return null;

  return (
    <>
      <Header />
      <Box flex="1" m={0} p={0}>
        {children}
      </Box>
      <Footer />
    </>
  );
};

