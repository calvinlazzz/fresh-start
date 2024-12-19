import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quote = () => {
    const [quote, setQuote] = useState({ quoteText: '', quoteAuthor: '' });

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/get-quote/');
                setQuote(response.data);
            } catch (error) {
                console.error('Error fetching the quote:', error);
            }
        };

        fetchQuote();
    }, []);

    return (
        <div>
            <h2>Quote of the Day</h2>
            <p>"{quote.quoteText}" - {quote.quoteAuthor}</p>
        </div>
    );
};

export default Quote;