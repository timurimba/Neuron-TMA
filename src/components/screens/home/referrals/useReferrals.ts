import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user/user.service';
import { IUser } from '@/types/user.types';
import { telegramId } from '@/consts/consts';

export const useRefferals = () => {
	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId),
	});

	const { data: totalReferralPoints, isLoading: isPointsLoading } = useQuery({
		queryKey: ['get-total-referral-points'],
		queryFn: () => UserService.getTotalReferralPoints(telegramId), // Передайте идентификатор пользователя
	});
	
	const inviteFriend = () => {
		window.open(
			`https://t.me/share/url?url=${encodeURIComponent(`Hi, here is a referral link to our App: https://t.me/Neuron_ton_bot?start=${telegramId}`)}`,
			'_blank'
		);
	};

	const getReferralsCount = () => {
		if (user?.referrals) {
			return user.referrals.length;
		}
		return 0;
	};

	return { user, isLoading: isUserLoading || isPointsLoading, getReferralsCount, inviteFriend, totalReferralPoints: totalReferralPoints ?? 0 };
};
