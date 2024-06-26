import React from 'react';
import styles from '//style.module.css'; // Import your CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.errorMessage}>
        <p>Error Message:</p>
        <p>(Fault Code): (Fault Message): (Solution)</p>
      </div>
    </footer>
  );
}

export default Footer;
