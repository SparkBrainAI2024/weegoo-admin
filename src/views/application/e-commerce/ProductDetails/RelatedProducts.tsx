import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import Slider, { Settings } from 'react-slick';

// project imports
import ProductCard from 'ui-component/cards/ProductCard';
import { getRelatedProducts } from 'api/products';

// types
import { Products } from 'types/e-commerce';

// ==============================|| PRODUCT DETAILS - RELATED PRODUCTS ||============================== //

const RelatedProducts = ({ id }: { id?: string }) => {
    const [related, setRelated] = useState<Products[]>([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));
    const upXL = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));

    const [loader, setLoader] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            await getRelatedProducts(id).then((response) => {
                setRelated(response.data);
                setLoader(false);
            });
        })();
    }, [id]);

    useEffect(() => {
        if (downSM) {
            setItemsToShow(1);
            return;
        }
        if (downMD) {
            setItemsToShow(2);
            return;
        }
        if (downLG) {
            setItemsToShow(3);
            return;
        }
        if (downXL) {
            setItemsToShow(4);
            return;
        }
        if (upXL) {
            setItemsToShow(5);
        }
    }, [downSM, downMD, downLG, downXL, upXL, itemsToShow]);

    const settings: Settings = {
        dots: false,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        centerPadding: '0px',
        slidesToShow: itemsToShow
    };

    let productResult: ReactElement | ReactElement[] = <></>;
    if (related && !loader) {
        productResult = related.map((product: Products, index: number) => (
            <Box key={index} sx={{ p: 1.5 }}>
                <ProductCard
                    key={index}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    offerPrice={product.offerPrice}
                    salePrice={product.salePrice}
                    rating={product.rating}
                />
            </Box>
        ));
    }

    return <Slider {...settings}>{productResult}</Slider>;
};

export default RelatedProducts;
