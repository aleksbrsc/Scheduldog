'use client';
import styles from '../css/components/navbar.module.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import logo from '../assets/logos/logo.svg';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';


const toastMessage = 'Sorry! A few parts of this web app are currently under development.';

function Navbar() {
  const pathname = usePathname();
  const [toggled, setToggled] = useState(false);
  const { user, isLoading } = useUser();

  function getActive(path) {
    if (pathname === path) {
      return styles.active;
    }
    return '';
  }

  function clickHandler() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (toggled) {
      setToggled(false);
    }
  }

  return (
    <nav className={styles.nav_container}>
      <div className={styles.nav} data-toggled={toggled}>
        <Link id={styles.logo_container} href="/" onClick={() => clickHandler()}>
          <Image id={styles.logo} src={logo} alt="Scheduldog logo" />
          <h1>Scheduldog</h1>
        </Link>
        <ul className={styles.list}>
          <li>
            <Image id={styles.mini_logo} src={logo} alt="Scheduldog logo" />
          </li>
          <li className={`${styles.list_item} ${getActive('/')}`}>
            <Link href="/" onClick={() => clickHandler()}>Home</Link>
          </li>
          <li className={`${styles.list_item} ${getActive('/about')}`}>
            <a onClick={() => toast.warning(toastMessage)}>About</a>
          </li>
          <li className={`${styles.list_item} ${getActive('/faq')}`}>
            <a onClick={() => toast.warning(toastMessage)}>FAQ</a>
          </li>
          <div id={styles.auth_buttons}>
            {!user && (
              <>
                <li id={styles.signup} className={`${styles.list_item}`}>
                  <Link href="/api/auth/login" onClick={() => clickHandler()}> Sign in </Link>
                </li>

                <li id={styles.login} className={`${styles.list_item}`}>
                  <Link href="/api/auth/login" onClick={() => clickHandler()}>Login</Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li id={styles.signup} className={`${styles.list_item}`}>
                  <Link href="/schedules" onClick={() => clickHandler()}>Schedules</Link>
                </li>

                <li id={styles.logout} className={`${styles.list_item}`}>
                  <Link href="/api/auth/logout" onClick={() => clickHandler()}>Logout</Link>
                </li>
              </>
            )}
          </div>


        </ul>
        {/* <div className={`${styles.list_item} ${styles.contact_button} ${getActive('/contact')}`}>
          <Link href="/contact" onClick={() => clickHandler()}>Contact us</Link>
        </div> */}
        <div className={styles.burger} onClick={() => setToggled(!toggled)}>
          <div />
          <div />
          <div />
        </div>
        <div className={`${styles.overlay} ${toggled && styles.active}`} onClick={() => setToggled(!toggled)}></div>
      </div>
    </nav>
  );
}

export default Navbar;
