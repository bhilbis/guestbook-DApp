// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Guestbook {
    //Struct ini mendefinisikan struktur data setiap pesan
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    //Array untuk menyimpan semua pesan yang masuk
    Message[] public messages;

    event NewMessage(address indexed from, uint256 timestamp, string text);

    /**
    * @dev Fungsi untuk mengirim pesan ke guestbook.
    * Membutuhkan transaksi
    */

    function postMessage(string memory _text) public {
        // Memastikan pesan tidak kosong
        require(bytes(_text).length > 0, "Message tidak boleh kosong.");

        // Membuat instance Message baru di memory dan menyimpannya ke array 'messages'
        messages.push(Message(msg.sender, _text, block.timestamp));

        // Memancarkan event NewMessage
        emit NewMessage(msg.sender, block.timestamp, _text);
    }

    /**
     * @dev Fungsi untuk ngambil semua pesan yang ada di guestbook.
     * <no gas fee>
     */
    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}