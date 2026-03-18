import Welcome from './Welcome'
import ChatContainer from './ChatContainer'

const ChatPage = ({currentUser,currentChat,setCurrentChat,socket,headers}) => {
  return (
    <div>
      {currentChat===undefined?(<Welcome currentUser={currentUser} />):(<ChatContainer headers={headers} socket ={socket}  currentChat={currentChat} currentUser={currentUser} setCurrentChat={setCurrentChat} />)}
      </div>
  )
}

export default ChatPage