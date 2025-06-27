interface StatsProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}

const Stats = ({
  totalTasks,
  completedTasks,
  inProgressTasks,
  pendingTasks,
}: StatsProps) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h2 className='text-lg font-medium text-secondary-900'>Quick Stats</h2>
      </div>
      <div className='card-body'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-secondary-600'>Total Tasks:</span>
            <span className='font-semibold'>{totalTasks}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-secondary-600'>Completed:</span>
            <span className='font-semibold text-green-600'>
              {completedTasks}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-secondary-600'>In Progress:</span>
            <span className='font-semibold text-blue-600'>
              {inProgressTasks}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-secondary-600'>Pending:</span>
            <span className='font-semibold text-yellow-600'>
              {pendingTasks}
            </span>
          </div>
          {totalTasks > 0 && (
            <div className='mt-4 pt-3 border-t border-secondary-200'>
              <div className='flex justify-between'>
                <span className='text-secondary-600'>Completion Rate:</span>
                <span className='font-semibold text-primary-600'>
                  {Math.round((completedTasks / totalTasks) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
