import { useEffect, useState } from 'react';
import { Clock, Activity } from 'lucide-react';
import { getLogs } from '../api';
import { formatRelativeTime } from '../utils/helpers';

const ActivityLogPanel = ({ taskId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    getLogs(taskId)
      .then((res) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return <div className="animate-pulse h-24 bg-gray-100 dark:bg-gray-700 rounded-lg" />;
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4" />
        Activity Log
      </h4>
      {logs.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log._id} className="flex items-start gap-2 text-xs">
              <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-400 shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{log.user?.name}</span>{' '}
                <span className="text-gray-500 dark:text-gray-400">{log.action}</span>
                <span className="flex items-center gap-1 text-gray-400 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {formatRelativeTime(log.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogPanel;
