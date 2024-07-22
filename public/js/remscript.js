document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  fetchNotifications();

  document.getElementById('reminderForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const message = document.getElementById('reminderMessage').value;
    const date = document.getElementById('reminderDate').value;

    try {
      await fetch('/v1/api/users/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, date })
      });
      document.getElementById('reminderForm').reset();
      fetchNotifications();
      window.location.href = '/v1/api/users/dashboard';
    } catch (error) {
      console.error('Error submitting reminder:', error);
    }
  });

  document.getElementById('goalForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const goalType = document.getElementById('goalType').value;
    const target = document.getElementById('target').value;
    const unit = document.getElementById('unit').value;
    const targetDate = document.getElementById('targetDate').value;

    try {
      await fetch('/v1/api/users/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalType, target, unit, targetDate })
      });
      document.getElementById('goalForm').reset();
      fetchNotifications();
      window.location.href = '/v1/api/users/dashboard';
    } catch (error) {
      console.error('Error submitting goal:', error);
    }
  });
});

async function fetchNotifications() {
  console.log('Fetching notifications...');
  try {
    const response = await fetch(`/v1/api/users/notification`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const notifications = await response.json();

    console.log('Notifications fetched:', notifications);
    //console.log('Notifications fetched:', 'good work');

    const reminders = notifications.reminder || [];
    const goals = notifications.goal || [];

    console.log('Reminders:', reminders);
    console.log('Goals:', goals);

    let notificationsHTML = '';
    let notificationCount = 0;

    reminders.forEach(reminder => {
      console.log('Processing reminder:', reminder);
      if (new Date() >= new Date(reminder.date) && !reminder.sent) {
        notificationsHTML += `
          <a class="dropdown-item preview-item">
            <div class="preview-thumbnail">
              <div class="preview-icon bg-dark rounded-circle">
                <i class="mdi mdi-calendar text-success"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject mb-1">Reminder</p>
              <p class="text-muted ellipsis mb-0">${reminder.message}</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>`;
        updateReminder(reminder._id); // Mark reminder as sent
        notificationCount++;
      }
    });

    goals.forEach(goal => {
      console.log('Processing goal:', goal);
      if (goal.currentProgress >= goal.target) {
        notificationsHTML += `
          <a class="dropdown-item preview-item">
            <div class="preview-thumbnail">
              <div class="preview-icon bg-dark rounded-circle">
                <i class="mdi mdi-trophy text-warning"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject mb-1">Goal Achieved</p>
              <p class="text-muted ellipsis mb-0">Congratulations! You have achieved your goal: ${goal.goalType}</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>`;
        notificationCount++;
      }
    });
    console.log(notificationsHTML);

    console.log('Notifications HTML:', notificationsHTML);
    const notificationList = document.getElementById('notification-elements');
    const notificationCountElement = document.getElementById('notification-count');

    //console.log('Notification list element:', notificationList);
    //console.log('Notification count element:', notificationCountElement);
    
    if (notificationList) {
      notificationList.innerHTML = notificationsHTML;
    } else {
      console.error('Notification list element not found');
    }
    
    if (notificationCountElement) {
      notificationCountElement.textContent = notificationCount > 0 ? notificationCount : '';
    } else {
      console.error('Notification count element not found');
    }

  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}

async function updateReminder(notificationId) {
  try {
    await fetch(`/v1/api/users/reminder/${notificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sent: true }),
    });
    console.log(`Reminder ${notificationId} marked as sent`); // Log reminder update
  } catch (error) {
    console.error('Error updating reminder:', error);
  }
}
