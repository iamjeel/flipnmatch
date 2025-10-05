
# Flip & Match - Memory Game

A **fun and challenging memory matching game** built with **React** featuring dynamic difficulty levels, timer, move counter, audio, and high scores. Test your memory skills while enjoying ambient music!

## 🚀 Features

* **Memory Matching Game**

  * Flip cards to find matching pairs.
  * Multiple levels that increase in difficulty.
  * Cards randomly shuffled every level.

* **Difficulty Levels**

  * **Easy:** 6 pairs
  * **Medium:** 8-9 pairs
  * **Hard:** 12 pairs
  * Adjust difficulty on the fly using a dropdown.

* **Game Stats**

  * Level tracker
  * Moves counter
  * Timer to track speed
  * High score saved per difficulty level (localStorage)

* **Audio Player**

  * Ambient background music with soothing chords.
  * Play, pause, mute/unmute.
  * Volume control slider.
  * Collapsible widget in top-right corner for desktop and mobile.

* **Animations & Effects**

  * Flip animation for cards.
  * Shake animation on wrong matches.
  * Confetti celebration on level completion.

* **Responsive Design**

  * Fully responsive for **mobile, tablet, and desktop**.
  * Grid layout adjusts based on difficulty and screen size.

* **Random Image Cards**

  * Uses **Lorem Picsum API** for placeholder images.
  * Duplicate images are paired for the memory game.

* **Controls**

  * Restart game
  * Refresh board with new images
  * Toggle difficulty

## 🛠 Tech Stack

* **Frontend:** React, TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Audio:** Web Audio API (custom ambient music)
* **State Management:** React `useState` and `useEffect`
* **Animations:** CSS transitions & keyframes
* **Data Storage:** LocalStorage for high scores

## 📦 Project Structure

```
src/
├── components/
│   ├── GameCard.tsx        # Card component
│   ├── AudioPlayer.tsx     # Collapsible music player
│   ├── Confetti.tsx        # Confetti animation component
├── hooks/
│   ├── useSoundEffects.ts  # Sound effects for flip/match/wrong/celebration
│   └── use-toast.ts        # Toast notifications
├── pages/
│   └── index.tsx           # Main game page
├── styles/
│   └── globals.css         # Tailwind + global styles
```

## ⚡ Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/flip-and-match.git
cd flip-and-match
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the app**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your game in the browser.

## 🔧 How to Play

1. Select a difficulty level (Easy, Medium, Hard).
2. Click cards to flip them and try to find matching pairs.
3. Complete all pairs to finish the level.
4. Moves, time, and high scores are tracked.
5. Enjoy ambient music with the top-right audio widget.

## 🎨 Customization

* **Change card images:** Modify the `LOREM_PICSUM_URL` or integrate your own API.
* **Add more levels or difficulties:** Update `DIFFICULTY_PAIRS` in `index.tsx`.
* **Adjust audio:** Modify `AudioPlayer.tsx` chord progressions or duration.

## 🖥 Responsive Behavior

* **Mobile & Tablet:** Grid and controls stay centered and easy to use.
* **Desktop & Laptop:** Smaller cards, fits entire game board without scrolling.
* Audio widget is always in the top-right corner and collapsible.

## 📁 Deployment

You can deploy this project using **Vercel, Netlify, or any static hosting**:

```bash
npm run build
npm run preview
```

## ❤️ Contributing

Feel free to open issues or submit pull requests. Any improvements to audio, animations, or UI are welcome!

## 📄 License

MIT License © 2024 Jeel Thumar