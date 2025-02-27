import React from 'react';
import img from '../admin/images/ub.jfif';

function About() {
    return (
        <div 
            className="bg-gray-100 text-gray-800 font-sans" 
           
        >
            <main className="py-10 px-4">
                <section className="mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl text-center text-orange-500 font-bold mb-6">About UberEats</h1>

                    <article className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
                        <p>
                            At <strong>UberEats</strong>, we believe that food delivery should be more than just a service; it should be an experience. Our journey began with a simple idea: to connect people with their favorite meals from local restaurants, ensuring a delightful dining experience from the comfort of home.
                        </p>
                    </article>

                    <article className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
                        <p>
                            From mouthwatering pizzas to exotic cuisines, we provide a wide variety of high-quality meals delivered right to your doorstep. Our platform allows you to explore different restaurants, ensuring you find the perfect dish for any craving.
                        </p>
                        <p>
                            Whether you're in the mood for a quick lunch, a family dinner, or late-night snacks, UberEats has something for everyone.
                        </p>
                    </article>

                    <article className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p>
                            We strive to provide a seamless food delivery experience, bringing the best dishes from local restaurants directly to you. We are committed to reflecting our values of convenience, quality, and community support.
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li><strong>Connect:</strong> We partner with local restaurants to offer you a diverse selection of cuisines.</li>
                            <li><strong>Deliver:</strong> Fast, reliable delivery to ensure your food arrives fresh and hot.</li>
                            <li><strong>Support:</strong> Exceptional customer service is always here to assist you with your orders.</li>
                        </ul>
                    </article>

                    <article className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose UberEats?</h2>
                        <ul className="list-disc list-inside ml-4">
                            <li><strong>Variety:</strong> Choose from a wide range of cuisines and restaurants at your fingertips.</li>
                            <li><strong>Convenience:</strong> Order food from the comfort of your home with just a few clicks.</li>
                            <li><strong>Quality:</strong> We prioritize quality by working with trusted restaurants and ensuring timely delivery.</li>
                        </ul>
                    </article>

                    <article className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Our Community</h2>
                        <p>
                            UberEats isn’t just a delivery service; it's a community of food lovers. Follow us on social media, subscribe to our newsletter, and be the first to know about new restaurant partnerships, special promotions, and exclusive deals. We value our customers and appreciate your feedback to continually improve our service.
                        </p>
                    </article>
                </section>
            </main>

            <footer className="bg-gray-900 text-white text-center py-4 mt-8">
                <p>&copy; 2024 UberEats. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default About;
