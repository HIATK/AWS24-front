import styled from 'styled-components';

interface StyledProps {
  $isOpen: boolean;
  $theme?: 'light' | 'dark';
}

export const SidebarContainer = styled.div<StyledProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({$isOpen}) => ($isOpen ? '150px' : '60px')};
  height: 100vh;
  background-color: ${({$theme}) => $theme === 'light' ? 'rgba(188,182,182,0.5)' : 'rgb(12,11,11)'};
  color: ${({$theme}) => $theme === 'light' ? '#333333' : '#6ebbdb'};
  transition: width 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom-right-radius: 13px;
  border-top-right-radius: 13px;
`;

export const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const MenuItemWrapper = styled.li<StyledProps>`
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 18px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isOpen, $theme }) =>
        $isOpen
            ? $theme === 'light'
                ? 'rgba(0,0,0,0.05)'
                : 'rgba(255,255,255,0.1)'
            : 'transparent'};
  }
`;

export const SettingsItemWrapper = styled(MenuItemWrapper)<StyledProps>`
  margin-top: auto;
  margin-bottom: 20px;
`;

export const ThemeToggleWrapper = styled(MenuItemWrapper)<StyledProps>`
  //margin-top: 59px;
  margin-bottom: 80% ;
`;

export const MenuLink = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
`;

export const Icon = styled.div<{$theme?: 'light' | 'dark'}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${({$theme}) => $theme === 'light' ? '#333333' : '#6EBBDBFF'};
`;

export const MenuText = styled.div<StyledProps>`
  margin-left: 10px;
  white-space: nowrap;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  color: ${({$theme}) => $theme === 'light' ? '#333333' : '#6EBBDBFF'};
`;

export const HoverText = styled.div<StyledProps>`
  position: absolute;
  left: ${({ $isOpen }) => ($isOpen ? '60px' : '100%')};
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({$theme}) => $theme === 'light' ? 'rgba(240, 240, 240, 0.9)' : 'rgba(33, 33, 33, 0.9)'};
  color: ${({$theme}) => $theme === 'light' ? '#333333' : '#6EBBDBFF'};
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease, left 0.3s ease;
  pointer-events: none;
  z-index: 1200;

  ${MenuItemWrapper}:hover & {
    opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
    left: ${({ $isOpen }) => ($isOpen ? '60px' : 'calc(100% + 5px)')};
  }
`;

export const SearchBarWrapper = styled.div`
  padding: 10px;
`;