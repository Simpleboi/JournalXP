/**
 * Focus Tap Page
 *
 * Main page wrapper for the Focus Tap mini-game.
 * Handles XP awarding integration with the app's XP system.
 */

import { FocusTapGame } from '@/features/focusTap/FocusTapGame';
import { SEO } from '@/components/SEO';
import { GameResult } from '@/features/focusTap/types';
import { useToast } from '@/hooks/useToast';

const FocusTapPage = () => {
  const { showToast } = useToast();

  const handleGameComplete = (result: GameResult) => {
    // Log completion for analytics
    console.log('Focus Tap game completed:', result);
  };

  const handleXpAwarded = (xp: number, mode: string) => {
    // Show XP toast notification
    showToast({
      title: mode === 'warmup' ? 'Focus Warm-Up Complete!' : 'Challenge Complete!',
      description: `You earned ${xp} XP!`,
      variant: 'default',
    });

    // TODO: Integrate with backend XP system
    // await authFetch('/api/focus-tap/award-xp', {
    //   method: 'POST',
    //   body: JSON.stringify({ xp, mode }),
    // });
  };

  return (
    <>
      <SEO
        title="Focus Tap - Focus Training Mini-Game"
        description="Train your focus and concentration with Focus Tap. Choose between calming Warm-Up mode or competitive Challenge mode to earn XP."
        url="https://journalxp.com/focus-tap"
      />

      <FocusTapGame
        onComplete={handleGameComplete}
        onXpAwarded={handleXpAwarded}
      />
    </>
  );
};

export default FocusTapPage;
