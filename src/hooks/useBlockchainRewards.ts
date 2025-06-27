import { useState, useCallback } from 'react';
import { algorandService, TokenReward } from '../services/algorandService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const useBlockchainRewards = () => {
  const { user } = useAuthStore();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const initializeWallet = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const address = await algorandService.initializeWallet();
      setWalletAddress(address);
      
      const currentBalance = await algorandService.getAccountBalance(address);
      setBalance(currentBalance);
      
      toast.success('Blockchain wallet connected!');
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      toast.error('Failed to connect blockchain wallet');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const rewardForActivity = useCallback(async (
    activity: string,
    amount: number
  ): Promise<TokenReward | null> => {
    if (!walletAddress) {
      await initializeWallet();
      return null;
    }

    try {
      const reward = await algorandService.rewardTokens(
        walletAddress,
        amount,
        activity
      );

      // Update local balance
      setBalance(prev => prev + amount);
      
      toast.success(`Earned ${amount} tokens for ${activity}!`);
      return reward;
    } catch (error) {
      console.error('Failed to reward tokens:', error);
      toast.error('Failed to process reward');
      return null;
    }
  }, [walletAddress, initializeWallet]);

  const verifyAchievement = useCallback(async (achievement: any) => {
    if (!walletAddress) return null;

    try {
      const txId = await algorandService.verifyAchievement(achievement);
      toast.success('Achievement verified on blockchain!');
      return txId;
    } catch (error) {
      console.error('Failed to verify achievement:', error);
      toast.error('Failed to verify achievement');
      return null;
    }
  }, [walletAddress]);

  const createStudyGroup = useCallback(async (
    participants: string[],
    goals: string[],
    rewardPool: number
  ) => {
    if (!walletAddress) return null;

    try {
      const contractId = await algorandService.createStudyContract(
        participants,
        goals,
        rewardPool
      );
      
      toast.success('Study group contract created!');
      return contractId;
    } catch (error) {
      console.error('Failed to create study group:', error);
      toast.error('Failed to create study group');
      return null;
    }
  }, [walletAddress]);

  return {
    walletAddress,
    balance,
    isLoading,
    initializeWallet,
    rewardForActivity,
    verifyAchievement,
    createStudyGroup
  };
};