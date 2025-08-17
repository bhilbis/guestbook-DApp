/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { contractAddress, contractABI } from './utils/contractInfo'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface Message {
  sender: string
  text: string
  timestamp: number
}

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [messagesText, setMessagesText] = useState<string>('')
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // function connect to wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any

      if (!ethereum) {
        alert('Please install wallet extension (e.g., MetaMask)')
        return;
      }

      const account = await ethereum.request({ method: 'eth_requestAccounts' })
      if (account.length > 0) {
        setCurrentAccount(account[0]);
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chainId:", chainId);
      if (chainId !== "0x7a69") { // 0x7a69 = 31337 (Hardhat)
        alert("Please switch MetaMask to Hardhat Localhost (Chain 31337)");
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    }
  }

  const checkContract = async () => {
    if (!window.ethereum) {
      console.error("MetaMask tidak ditemukan");
      return;
    }

    // connect ke provider (MetaMask)
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const messagesFromContract = await contract.getMessages()

    console.log('Messages from contract:', messagesFromContract)

    // cek bytecode di alamat contract
    const block = await provider.getBlockNumber();
    console.log("Current block:", block);
    const code = await provider.getCode(contractAddress, block); // pakai block yg valid

    console.log("Contract code:", code);

    if (code === "0x") {
      console.error("⚠️ Alamat ini bukan smart contract. Cek contractAddress atau network!");
    } else {
      console.log("✅ Smart contract terdeteksi di address:", contractAddress);
    }
  }

  // function to get all messages
  const getAllMessages = async () => {
    try {
      const { ethereum } = window as any
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        const messagesFromContract = await contract.getMessages()
        console.log('Messages from contract:', messagesFromContract)

        const formattedMessages: Message[] = messagesFromContract.map((msg: any) => ({
          sender: msg.sender,
          text: msg.text,
          timestamp: new Date(Number(msg.timestamp) * 1000).getTime()
        }))
        setAllMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // function to send message
  const postMessage = async () => {
    if (!messagesText) {
      alert('Message cannot be empty')
      return
    }
    setIsLoading(true)
    try {
      const { ethereum } = window as any
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const tx = await contract.postMessage(messagesText)
        console.log('Transaction sent;', tx.hash)

        await tx.wait()
        console.log('Transaction confirmed:', tx.hash)

        setMessagesText('')

        await getAllMessages()
      }
    } catch (error) {
      console.error('Error posting message:', error)
      alert('Error posting message')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkIfWalletIsConnect = async () => {
      //
    }
    checkIfWalletIsConnect();
    getAllMessages()
  }, [])

  useEffect(() => {
    const { ethereum } = window as any
    if (!ethereum) return

    const provider = new ethers.BrowserProvider(ethereum)
    const contract = new ethers.Contract(contractAddress, contractABI, provider)

    const onNewMessage = (from: string, timestamp: any, text: string) => {
      console.log("NewMessage event received!", from, timestamp, text)
      setAllMessages(prevState => [
        ...prevState,
        {
          sender: from,
          text: text,
          timestamp: new Date(timestamp * 1000).getTime()
        },
      ])
    }

    contract.on("NewMessage", onNewMessage)

    return () => {
      contract.off("NewMessage", onNewMessage)
    }
  }, [])

  return (
    <div className='h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 overflow-hidden w-full'>
      <div className='h-full flex flex-col'>
        {/* Header */}
        <div className='text-center py-6 flex-shrink-0'>
          <h1 className='text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            On-Chain GuestBook
          </h1>
          <p className='text-slate-600'>Share your thoughts on the blockchain</p>
        </div>

        {/* Main Content */}
        <div className='flex-1 px-4 pb-4 overflow-hidden'>
          <div className='h-full w-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 h-full w-full'>
              
              {/* Left Column - Input Section */}
              <div className='flex flex-col'>
                {currentAccount ? (
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 h-full flex flex-col">
                    <div className='flex items-center gap-3 mb-4 flex-shrink-0'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span className='text-sm font-medium text-slate-600'>
                        Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                      </span>
                    </div>
                    
                    <div className='flex-1 flex flex-col gap-4'>
                      <textarea
                        className='flex-1 p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-slate-700 placeholder-slate-400'
                        placeholder='Share your message with the world...'
                        value={messagesText}
                        onChange={(e) => setMessagesText(e.target.value)}
                      />
                      <button 
                        className='py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex-shrink-0'
                        onClick={postMessage}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className='flex items-center justify-center gap-2'>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            Publishing...
                          </div>
                        ) : (
                          'Publish Message'
                        )}
                      </button>
                    </div>
                    
                    {/* Debug Button */}
                    <div className='mt-4 text-center flex-shrink-0'>
                      <button 
                        onClick={checkContract}
                        className='px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium border border-slate-300 hover:border-slate-400 rounded-lg transition-colors duration-200'
                      >
                        Debug Contract
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center h-full flex flex-col justify-center">
                    <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                      <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                      </svg>
                    </div>
                    <h3 className='text-xl font-semibold text-slate-800 mb-2'>Connect Your Wallet</h3>
                    <p className='text-slate-600 mb-6'>Connect your wallet to start sharing messages</p>
                    
                    <button 
                      className='py-3 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg'
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                    
                    {/* Debug Button */}
                    <div className='mt-6'>
                      <button 
                        onClick={checkContract}
                        className='px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium border border-slate-300 hover:border-slate-400 rounded-lg transition-colors duration-200'
                      >
                        Debug Contract
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Messages Section */}
              <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col'>
                <div className='p-4 border-b border-slate-200 bg-slate-50 flex-shrink-0'>
                  <h2 className='text-xl font-bold text-slate-800 flex items-center gap-2'>
                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                    Messages ({allMessages.length})
                  </h2>
                </div>
                
                <div className='flex-1 overflow-y-auto'>
                  {allMessages.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center p-8'>
                      <div className='w-12 h-12 bg-slate-100 rounded-full mb-3 flex items-center justify-center'>
                        <svg className='w-6 h-6 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                        </svg>
                      </div>
                      <p className='text-slate-500 font-medium'>No messages yet</p>
                      <p className='text-slate-400 text-sm'>Be the first to share!</p>
                    </div>
                  ) : (
                    <div className='p-4 space-y-3'>
                      {[...allMessages].sort((a, b) => b.timestamp - a.timestamp).map((msg, index) => (
                        <div key={index} className='bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-all duration-200'>
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                              <div className='w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                                <span className='text-white text-xs font-bold'>
                                  {msg.sender.slice(2, 4).toUpperCase()}
                                </span>
                              </div>
                              <span className='text-xs font-mono text-slate-500 truncate max-w-24'>
                                {msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}
                              </span>
                            </div>
                            <span className='text-xs text-slate-400'>
                              {new Date(msg.timestamp).toLocaleDateString()} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className='text-slate-700 text-sm leading-relaxed'>{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App