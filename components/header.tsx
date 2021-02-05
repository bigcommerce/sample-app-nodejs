import { H2, Link } from '@bigcommerce/big-design';
import { useStore } from '../lib/hooks';

interface HeaderProps {
    title: string;
}

const Header = ({ title }: HeaderProps) => {
    const { storeId } = useStore();
    const storeLink = `https://store-${storeId}.mybigcommerce.com/manage/marketplace/apps/my-apps`;

    return (
        <>
            <Link href={storeLink}>My Apps</Link>
            <H2 marginTop="medium">{title}</H2>
        </>
    );
};

export default Header;
