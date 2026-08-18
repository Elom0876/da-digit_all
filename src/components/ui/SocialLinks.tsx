type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61593534561089";
const WHATSAPP_URL = "https://wa.me/22940260809";

/** Liens sociaux : au survol, le cercle passe en doré-beige et rebondit
 *  façon ressort (scale qui dépasse la cible puis se stabilise). */
export default function SocialLinks({
  className = "",
  iconClassName = "h-4 w-4",
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <style>{`
        .social-icon-link {
          transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.3s ease, border-color 0.25s ease;
        }
        .social-icon-link:hover,
        .social-icon-link:focus-visible {
          animation: socialBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          background-color: #E8C888;
          border-color: #E8C888;
          color: #241B4B;
          box-shadow: 0 10px 26px -10px rgba(196, 156, 74, 0.55);
        }
        @keyframes socialBounce {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.25); }
          60%  { transform: scale(0.9); }
          80%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>

      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="DA Digit All sur Facebook"
        className="social-icon-link flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink/60 focus-visible:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClassName}
          aria-hidden
        >
          <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.459h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33v7.03C18.343 21.244 22 17.08 22 12.06Z" />
        </svg>
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="DA Digit All sur WhatsApp"
        className="social-icon-link flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink/60 focus-visible:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClassName}
          aria-hidden
        >
          <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.828.482 3.545 1.32 5.03L2 22l5.11-1.34A9.96 9.96 0 0 0 12.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2Zm5.468 12.382c-.248.694-1.436 1.328-2.006 1.413-.51.077-1.159.109-1.871-.118a12.7 12.7 0 0 1-1.694-.625c-2.981-1.287-4.928-4.29-5.076-4.487-.148-.199-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.48.272-.297.594-.371.792-.371.198 0 .397.002.57.01.182.01.427-.069.669.51.247.595.841 2.059.916 2.207.075.149.124.323.025.521-.1.199-.149.323-.298.497-.148.173-.312.387-.446.52-.148.149-.303.31-.13.607.173.297.77 1.27 1.653 2.058 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.198-.298.397-.249.67-.15.272.099 1.733.818 2.03.967.297.149.495.223.57.347.075.124.075.719-.173 1.413Z" />
        </svg>
      </a>
    </div>
  );
}
