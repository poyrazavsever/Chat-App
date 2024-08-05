import {useEffect, useState} from "react"
import Pusher from "pusher-js";

export default function Home() {

  const [username,setUsername] = useState('username');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  let allMessages = [];

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('2d783c6b18f7d45d75a7', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', function(data) {
      allMessages.push(data);
      setMessages(allMessages)
    });
  });

  const submit = async (e) => {

    e.preventDefault();

    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        username,
        message
      })
    });

    setMessage('')

  }
  
  return (
    <div className="w-full p-12">

      <div>
        <div className="flex flex-col items-start gap-8">
          <div>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="bg-transparent border border-neutral-600 px-5 py-2"/>
          </div>

          <div className="flex flex-col items-start gap-3">
            {messages.map(message => {
              return(
                <div>
                    <h4 className="font-black uppercase tracking-widest text-neutral-800">{message.username}</h4>

                    <p className="tracking-wide">{message.message}</p>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={submit} className="pt-8">

          <input type="text" placeholder="write a message" className="py-4 px-6 border border-neutral-600 w-full" value={message} onChange={e => setMessage(e.target.value)}/>

        </form>

      </div>

    </div>
  );
}
