import {useEffect, useState} from "react"
import Pusher from "pusher-js";

export default function Home() {

  const [username,setUsername] = useState('');
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
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="name" className="text-neutral-900 text-xs font-semibold uppercase tracking-widest">Your Name</label>
            <input id="name" type="text" placeholder="David Broo" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 bg-neutral-950 opacity-80 focus:outline-none border-neutral-950 placeholder:text-sm placeholder:tracking-wide placeholder:text-zinc-500 text-white"/>
          </div>

          <div className="w-full">
            {messages.map(message => {
              return(
                <div className="flex flex-col items-start gap-2 w-full px-8 py-4 bg-neutral-200">
                    <h4 className="font-black uppercase tracking-widest text-neutral-800">{message.username}</h4>

                    <p className="tracking-wide">{message.message}</p>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col items-start gap-2 pt-12">
            <label htmlFor="name" className="text-neutral-900 text-xs font-semibold uppercase tracking-widest">Your Message</label>
            
            <textarea type="text" placeholder="write a message" className="w-full h-96 px-4 py-6 bg-neutral-950 opacity-80 focus:outline-none border-neutral-950 placeholder:text-sm placeholder:tracking-wide placeholder:text-zinc-500 text-white" value={message} onChange={e => setMessage(e.target.value)}/>


            <button type="submit" className="text-white text-lg font-medium bg-neutral-800 w-full py-4 hover:bg-neutral-600 transition-all">Send</button>
          

        </form>

      </div>

    </div>
  );
}
