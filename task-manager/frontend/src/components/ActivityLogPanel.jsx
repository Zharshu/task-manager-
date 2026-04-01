import { useEffect, useState } from 'react';
import { Activity, Clock, Loader2 } from 'lucide-react';
import { getLogs } from '../api';
import { formatRelativeTime } from '../utils/helpers';

const ActivityLogPanel = ({ taskId }) => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    getLogs(taskId)
      .then((res) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton h-10" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
        <Activity size={15} className="text-indigo-500" />
        Activity Log
      </h4>

      {logs.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">No activity recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log._id} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0 mt-1.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{log.user?.name}</span>{' '}
                  {log.action}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  <Clock size={10} />
                  {formatRelativeTime(log.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogPanel;
