'use client';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

const BENEFITS = [
  { icon: 'cloud_done', title: 'Cloud Sync', description: 'Never lose your training history' },
  { icon: 'public', title: 'Global Leaderboard', description: 'See how you rank worldwide' },
  { icon: 'groups', title: 'Compete with Friends', description: 'Challenge your inner circle' },
];

export function AccountModal({ open, onClose }: AccountModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-inverse-surface/40"
      onClick={onClose}
      data-testid="account-modal-backdrop"
    >
      <div
        className="w-full max-w-content bg-surface-container-lowest rounded-t-[24px] p-md pb-lg flex flex-col gap-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto" />
        <div>
          <h2 className="font-display text-headline-md text-on-surface mb-xs">Save Your Progress</h2>
          <p className="font-body text-body-md text-on-surface-variant">
            Create an account to securely store your cognitive gains and unlock full features.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-sm">
              <span aria-hidden="true" className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-xs">
                {benefit.icon}
              </span>
              <div>
                <h3 className="font-label-bold text-label-bold text-on-surface">{benefit.title}</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-sm mt-sm">
          <button
            type="button"
            disabled
            title="Accounts aren't available yet"
            className="w-full h-14 rounded-full bg-primary/40 text-on-primary font-label-bold text-label-bold cursor-not-allowed"
          >
            Create Account (Coming Soon)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-14 rounded-full bg-primary/10 text-primary font-label-bold text-label-bold"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
