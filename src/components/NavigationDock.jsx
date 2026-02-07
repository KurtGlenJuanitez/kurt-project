import { useApp } from '../context/AppContext';
import Dock from './Dock/Dock';

const iconBaseProps = {
  className: 'dock-svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
};

function HomeIcon() {
  return (
    <svg {...iconBaseProps}>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg {...iconBaseProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-5 4 4 3-3 6 6" />
      <circle cx="9" cy="9" r="1.5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg {...iconBaseProps}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg {...iconBaseProps}>
      <path d="M4 6h10" />
      <path d="M4 12h16" />
      <path d="M4 18h8" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="10" cy="18" r="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg {...iconBaseProps}>
      <rect x="5" y="11" width="14" height="9" rx="2" />s
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function NavigationDock() {
  const { activeDock, handleDockClick, isAnniversaryUnlocked } = useApp();

  const items = [
    {
      icon: <HomeIcon />,
      label: 'Home',
      onClick: () => handleDockClick(0),
      className: activeDock === 0 ? 'active' : '',
    },
    {
      icon: isAnniversaryUnlocked ? <GalleryIcon /> : <LockIcon />,
      label: 'Memories',
      onClick: () => handleDockClick(1),
      className: `${activeDock === 1 ? 'active' : ''} ${!isAnniversaryUnlocked ? 'locked' : ''}`,
    },
    {
      icon: isAnniversaryUnlocked ? <MessageIcon /> : <LockIcon />,
      label: 'Messages',
      onClick: () => handleDockClick(2),
      className: `${activeDock === 2 ? 'active' : ''} ${!isAnniversaryUnlocked ? 'locked' : ''}`,
    },
    {
      icon: <SettingsIcon />,
      label: 'Settings',
      onClick: () => handleDockClick(3),
      className: activeDock === 3 ? 'active' : '',
    },
  ];

  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      distance={150}
      spring={{ mass: 0.1, stiffness: 170, damping: 14 }}
    />
  );
}
