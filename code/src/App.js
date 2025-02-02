/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import MessageList from 'components/MessageList';
import NewMessage from 'components/NewMessage';
import Footer from 'components/Footer';

export const App = () => {
  const [newMessage, setNewMessage] = useState('');
  const [newLike, setNewLike] = useState(false)
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // Function that calls the messages from the database
  const fetchMessages = () => {
    fetch('https://project-happy-thoughts-api-auhzlcxnrq-lz.a.run.app/messages')
      .then((result) => result.json())
      .then((json) => setMessageList(json.response))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false)
        setNewLike(false)
      })
  }

  // useEffect is triggered on restart, newLike and loading
  useEffect(() => {
    // Restricts that the fetchMessages will only run when the newLike or loading
    // is set to true, otherwise it runs twice for every change.
    if (newLike === true || loading === true) {
      fetchMessages();
    }
  }, [newLike, loading]);

  // Function that handles the user-input so the text is shown then the user types it
  // and that the character-count is updating in real time
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value)
    setCount(event.target.value.length)
  }

  // Function that adds the users message to the database.
  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: newMessage
      })
    }
    fetch('https://project-happy-thoughts-api-auhzlcxnrq-lz.a.run.app/messages', options)
      .then((result) => result.json())
      .then((data) => fetchMessages(data.response))
      .catch((error) => console.error(error))
      .finally(() => setNewMessage(''));
  }

  // Updates the page every 5 minutes if no other way of update has been triggered
  if (loading) {
    setInterval(fetchMessages, 5 * 60 * 1000);
    return (
      <p>Loading in progress...</p>
    )
  }

  return (
    <div className="outer-wrapper">
      <NewMessage
        newMessage={newMessage}
        onNewMessageChange={handleNewMessageChange}
        onFormSubmit={onFormSubmit}
        count={count} />
      <MessageList
        setNewLike={setNewLike}
        loading={loading}
        setLoading={setLoading}
        messageList={messageList}
        setMessageList={setMessageList} />
      <Footer />
    </div>
  );
}