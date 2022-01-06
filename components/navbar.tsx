import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { WalletContext } from "./context/walletContext";
import Profile from "./profile";

const NavBar = () => {
  const router = useRouter();
  const navBarItemSelectedStyle =
    "text-blue-500 bg-gradient-to-l from-blue-100 to-white border-blue-500 dark:from-gray-700 dark:to-gray-800 border-l-4";
  const navBarItemUnSelectedStyle =
    "text-gray-500 dark:text-gray-200 hover:text-blue-500";
  const navBarItems = [
    {
      texts: "Mint NFT",
      href: "/mint",
    },
    // {
    //   texts: "All NFT",
    //   href: "/all",
    // },
    // {
    //   texts: "Created NFT",
    //   href: "/created",
    // },

    {
      texts: "FAQ",
      href: "/faq",
    },
  ];

  const walletContext = useContext(WalletContext);

  const handleLogout = () => {
    walletContext.setAccounts([]);
  };

  return (
    <div className="flex-initial lg:sticky top-0 h-screen lg:block my-4 ml-4 shadow-lg w-70">
      <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
        <Profile />
        <div>
          {navBarItems.map((item) => (
            <div
              key={item.texts}
              className={
                router.asPath === item.href
                  ? navBarItemSelectedStyle
                  : navBarItemUnSelectedStyle
              }
            >
              <Link href={item.href}>
                <a className="w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start ">
                  <span className="mr-4 text-sm font-normal">{item.texts}</span>
                </a>
              </Link>
            </div>
          ))}
          <div className={navBarItemUnSelectedStyle}>
            <Link href="/">
              <a
                onClick={handleLogout}
                className="w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start "
              >
                <span className="mr-4 text-sm font-normal">Logout</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
