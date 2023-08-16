'use client';
import React, { useState, useEffect } from 'react';
import '../app/globals.css';
import {
  collection,
  addDoc,
  query,
  getDoc,
  querySnapshot,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([
    // { name: 'Coffee', price: 4.95 },
    // { name: 'Movie', price: 24.95 },
    // { name: 'candy', price: 7.95 },
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '', date: '' });
  const [total, setTotal] = useState(0);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      const now = serverTimestamp(); // แสดงเวลาปัจจุบัน
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
        date: now,
      });
      setNewItem({ name: '', price: '', date: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      // Sort itemsArr by date in descending order (latest first)
      itemsArr.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.seconds - a.date.seconds;
        }
        return 0;
      });

      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();

      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-1'>
      <div className='z-10 w-full max-w-5xl items-center justify-between'>
        <h1 className='text-4xl text-center'>T H X K S E R V I C E</h1>
        <h1 className='text-2xl p-2 text-center'>E X P E N S E S + F I R E B A S E</h1>
        <h1 className='text-2xl mb-2 text-center'>สมุดบันทึกรายจ่ายประจำเดือน</h1>
        <div className='bg-violet-300 p-4 rounded-2xl'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border text-base rounded-lg'
              type='text'
              placeholder='เพิ่มรายการ'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className='col-span-2 p-3 border text-base rounded-lg mx-3'
              type='number'
              placeholder='ราคา'
            />
            <button
              onClick={addItem}
              className='text-white bg-violet-950 hover:bg-violet-900 p-3 text-xl rounded-lg'
              type='submit'
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between text-base bg-violet-900 rounded-2xl'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span>
                    <span className='bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'>Date </span>{item.date ? item.date.toDate().toLocaleDateString() : ''}{' '}
                    <span className='bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>Time </span>{item.date ? item.date.toDate().toLocaleTimeString() : ''}
                  </span>
                  <span>

                    <span className='capitalize'>{item.name}</span>
                  </span>
                  <span className='ml-6'>{item.price} บาท</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-violet-900 hover:bg-violet-950 rounded-2xl w-16'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            <div className='p-3 mt-2 bg-violet-950 text-lg text-center rounded-2xl'>
              <span>ไม่พบข้อมูลในฐานข้อมูล กรุณาเพิ่มรายการ</span>
            </div>
          ) : (
            <div className='flex justify-between p-3 bg-violet-950 text-xl rounded-2xl'>
              <span>ยอดเงินรวม</span>
              <span className='text-2xl'>{total} บาท</span>
            </div>
          )}
        </div>
      </div>

      <footer class="bg-violet-950 rounded-lg shadow m-4">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" class="hover:underline">THXK-SERVICE</a>. All Rights Reserved. Development by NEXT.JS + Tailwind CSS Framework
          </span>
        </div>
      </footer>
    </main>
  );
}
