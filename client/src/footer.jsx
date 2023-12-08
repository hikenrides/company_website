import React from "react";
import './footer.css';
import fb from './assets/fbimg.png';
import twitter from './assets/twitterimg.png';
import linkedin from './assets/linkedinimg.png';
import insta from './assets/instaimg.png';

const Footer= () =>{
    return (
        <div className="footer mb-0">
            <div className="sb__footer section__padding">
                <div className="sb__footer-links">
                    
                    <div className="sb__footer-links_div">
                        <h4>Resources</h4>
                        <a href="/resource">
                            <p>Resource Center</p>
                        </a>
                        <a href="/resource">
                            <p>Testimonials</p>
                        </a>
                        <a href="/resource">
                            <p>STV</p>
                        </a>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Contact Us
                        </h4>
                        <p>Whatsapp: +27 645388351</p>
                        <p>Email: info@hikenrides.com</p>
                    </div>
                    <div className="sb__footer-links_div">
                    <h4>Company</h4>
                        <a href="/about">
                            <p>About Us</p>
                        </a>
                        <a href="/press">
                            <p>Trips</p>
                        </a>
                        <a href="/career">
                            <p>Requests</p>
                        </a>
                        <a href="/contact">
                            <p>Drivers</p>
                        </a>
                        
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Social media</h4>
                        <div className="socialmedia">
                            <a href="https://www.facebook.com/profile.php?id=61553868901955"><p><img src={fb} alt=""/></p></a>
                            <p><img src={twitter} alt=""/></p>
                            <p><img src={linkedin} alt=""/></p>
                            <p><img src={insta} alt=""/></p>
                        </div>
                    </div>
                </div>

                <hr></hr>

                <div className="sb__footer-below">
                    <div className="sb__footer-copyright">
                        <p>
                            @2023 Hikenrides. All Rights Reserved.
                        </p>
                    </div>
                    <div className="sb__footer-below-links">
                        <a href="/terms"><div><p>Terms & Conditions</p></div></a>
                        <a href="/privacy"><div><p>Privacy</p></div></a>
                        <a href="/security"><div><p>Security</p></div></a>
                        <a href="/cookies"><div><p>Cookie Declaration</p></div></a>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer;