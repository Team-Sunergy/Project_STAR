import React from 'react';
import styles from '../styles.module.css'; // Import your CSS module

const Header = () => {
  return (
    <header className={styles.header}>
      <a href="/index.html">
        <div className={styles.teamLogo}>TEAM <span className={styles.sunergy}>SUNERGY</span></div>
      </a>
      <div className={styles.clock}>
        <span id="hours"></span><span>:</span><span id="minutes"></span><span id="ampm"></span>
      </div>
    </header>
  );
}

export default Header;
