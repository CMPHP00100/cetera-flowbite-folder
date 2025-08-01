"use client";
import Link from "next/link";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

const RESOURCES = [
  { href: "/resources/blog", label: "Blog" },
  { href: "/resources/careers", label: "Careers" },
  { href: "#", label: "Services" },
  { href: "#", label: "Our Partners" },
];
const SUPPORT = [
  { href: "#", label: "Contact" },
  { href: "/support/privacy-policy", label: "Privacy Policy" },
  { href: "/support/terms-and-conditions", label: "Terms & Conditions" },
];
const SOCIALS = [
  {
    id: "1",
    href: "#",
    className: "facebook",
    svglink:
      "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951",
  },
  {
    id: "2",
    href: "https://www.instagram.com/ceteramarketing/",
    className: "instagram",
    svglink:
      "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
  },
  {
    id: "3",
    href: "https://x.com/ceteramarketing",
    className: "twitter",
    svglink:
      "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z",
  },
  {
    id: "4",
    href: "https://www.tiktok.com/@ceteramarketing",
    className: "tiktok",
    svglink:
      "M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z",
  },
  {
    id: "5",
    href: "#",
    className: "linkedin",
    svglink:
      "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  },
];

const Footer = () => {
  return (
    <footer className="bg-cetera-dark-blue p-4 align-bottom sm:p-6">
      <div className="continer-fluid mx-auto">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 md:mb-0">
            <a href="/" className="flex items-center">
              <Image
                src="/assets/logos/CM_logo_LightGray.svg"
                className="h-8 mr-3 w-20"
                alt="Cétera Marketing"
                width="200"
                height="100"
              />
              <p className="self-center whitespace-nowrap text-cetera-light-gray hover:text-cetera-mono-orange">
                <span className="text-[1.4rem] flex lh-1">Cétera Marketing</span>
                <span className="text-2sm lh-1">we spark ideas</span>
              </p>
            </a>
            <div className="mt-4 flex space-x-4">
              {SOCIALS.map(({ href, className, svglink, id }) => (
                <a key={id} href={href} target="_blank" className={className}>
                  <svg
                    className="text-cetera-light-gray hover:text-cetera-mono-orange social-footer-links h-6 w-6 ms-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d={svglink} clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8">
            <div className="row mt-md-0 mt-4">
              <div className="d-none d-sm-none d-md-block col-md-4 col-lg-6"></div>
              <div className="col-6 col-sm-6 col-md-4 col-lg-3">
                <h2 className="mb-2 text-sm font-cetera-josefin uppercase text-cetera-mono-orange font-bold">Resources</h2>
                <ul className="ps-0 text-gray-400">
                  {RESOURCES.map(({ href, label }) => (
                    <li key={href + label} className="mb-2">
                      <Link
                        href={href}
                        className="text-cetera-light-gray hover:text-cetera-mono-orange"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-sm-6 col-md-4 col-lg-3">
                <h2 className="mb-2 text-sm font-cetera-josefin font-bold uppercase text-cetera-mono-orange">Support</h2>
                <ul className="ps-0 text-gray-400">
                  {SUPPORT.map(({ href, label }) => (
                    <li key={href + label} className="mb-2">
                      <Link
                        href={href}
                        className="text-cetera-light-gray hover:text-cetera-mono-orange"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:flex sm:items-center sm:justify-between pt-2">
          <span className="text-sm text-cetera-light-gray sm:text-center">
            © 2022{" "}
            <a href="https://ceteramarketing.com" className="text-cetera-mono-orange hover:text-cetera-light-gray">
              Cétera Marketing™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
