# Firebase Notification Queue System for LMS

A scalable notification system that automatically uses **BullMQ** queue when sending notifications to 100+ users.

## 🎯 Key Features

- **Automatic batching**: Sends directly for < 100 users, uses queue for 100+
- **Smart batch processing**: Splits large notifications into 500-token batches (Firebase limit)
- **Built-in retry mechanism**: Automatically retries failed notifications
- **Concurrent processing**: Processes multiple batches simultaneously
- **Queue monitoring**: Track notification status in real-time

## 📁 File Structure

```
notification-queue-service.js  → Main service (decides queue vs direct)
notification-worker.js         → Worker that processes queue jobs
lms-integration.js             → LMS integration layer
example-usage.js               → Usage examples
package.json                   → Dependencies
.env.example                   → Environment variables template
```

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Add your Firebase credentials:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis

# Or using local Redis
redis-server
```

### 4. Start the Worker

```bash
node notification-worker.js
```

Keep this running - it processes queued notifications.

## 📖 Usage

### Basic Usage in Your LMS

```javascript
const lmsNotificationManager = require('./lms-integration');

// Send notifications (automatically decides queue vs direct)
const tokens = ['token1', 'token2', ...]; // User FCM tokens

const notification = {
  title: 'Class Reminder',
  body: 'Your class starts in 30 minutes',
  data: {
    type: 'class_reminder',
    classId: 'CS101'
  }
};

const result = await lmsNotificationManager.sendNotification(tokens, notification);
```

### Behavior

- **< 100 users**: Sends immediately using Firebase `multiSend()`
- **≥ 100 users**: Adds to BullMQ queue, worker processes in batches

### Real LMS Examples

```javascript
// Course announcement to all enrolled students
await lmsNotificationManager.sendCourseAnnouncement(courseId, {
  title: 'Exam Schedule',
  body: 'Midterm on March 15th',
});

// Assignment reminder
await lmsNotificationManager.sendAssignmentReminder(assignmentId);

// System broadcast to all users
await lmsNotificationManager.sendSystemBroadcast(
  'Maintenance Notice',
  'System will be down for 1 hour tonight'
);
```

## 🔧 Configuration

### Adjust Threshold

In `notification-queue-service.js`:

```javascript
this.BATCH_THRESHOLD = 100; // Change this number
```

### Adjust Batch Size

```javascript
this.BATCH_SIZE = 500; // Firebase allows max 500 per multiSend
```

### Worker Concurrency

In `notification-worker.js`:

```javascript
{
  concurrency: 5,  // Process 5 batches at once
  limiter: {
    max: 10,       // Max 10 jobs per second
    duration: 1000
  }
}
```

## 📊 Monitoring Queue

```javascript
const stats = await notificationQueueService.getQueueStats();

console.log(stats);
// {
//   waiting: 5,
//   active: 2,
//   completed: 100,
//   failed: 3
// }
```

## 🧪 Testing

Run the examples:

```bash
node example-usage.js
```

This will test:
- Small notifications (< 100) → Direct send
- Large notifications (> 100) → Queued
- Massive broadcasts (1500+) → Multiple batches

## 🔍 How It Works

```
User Request → LMS Integration Layer
                     ↓
          Notification Queue Service
          (Checks user count)
                     ↓
         < 100 users? → Send directly via Firebase
         ≥ 100 users? → Add to BullMQ queue
                     ↓
                Worker picks up job
                     ↓
          Calls Firebase multiSend()
          (in batches of 500)
```

## 📝 Package.json Scripts

```bash
npm run worker    # Start the notification worker
npm run test      # Run usage examples
```

## ⚠️ Important Notes

1. **Worker must be running**: Jobs won't process without the worker
2. **Redis required**: Make sure Redis is accessible
3. **Firebase credentials**: Must be valid for notifications to send
4. **FCM tokens**: Ensure tokens are valid and not expired

## 🛠️ Troubleshooting

**Queue not processing?**
- Check if worker is running: `node notification-worker.js`
- Verify Redis is accessible: `redis-cli ping`

**Notifications failing?**
- Check Firebase credentials in `.env`
- Verify FCM tokens are valid
- Check worker logs for errors

**Want to see queue visually?**
- Install Bull Board (optional monitoring dashboard)

## 📦 Dependencies

- `bullmq` - Queue system
- `ioredis` - Redis client
- `firebase-admin` - Firebase notifications

## 🎓 Integration with Your LMS

Replace mock database functions in `lms-integration.js`:

```javascript
async getEnrolledStudents(courseId) {
  // Your actual DB query
  return await db.students.find({ enrolledCourses: courseId });
}
```

Then use anywhere in your LMS:

```javascript
const lmsNotificationManager = require('./lms-integration');
await lmsNotificationManager.sendCourseAnnouncement(courseId, announcement);
```

Done! 🎉
