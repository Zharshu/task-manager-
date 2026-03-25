import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

let socket = null;

const useSocket = () => {
  const { addOrUpdateTask, removeTask } = useTaskStore();

  useEffect(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL);

    socket.on('task:created', (task) => addOrUpdateTask(task));
    socket.on('task:updated', (task) => addOrUpdateTask(task));
    socket.on('task:deleted', ({ id }) => removeTask(id));

    return () => {
      socket.disconnect();
    };
  }, [addOrUpdateTask, removeTask]);
};

export default useSocket;
