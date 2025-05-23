import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ActionCard from "./ActionCard";
import { ActionCardDetails } from "../../types/ActionCardDetails";

export default function MultiCarousel({items}: {items: ActionCardDetails[] }) {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };

    return (
        <Carousel  
            responsive={responsive}
            infinite={true}
            draggable={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
        >
            {items.map((item) => (
                <ActionCard
                    key={item.key}
                    imgSrc={item.imgSrc}
                    title={item.title}
                    description={item.description}
                    height={300}
                    width={300}
                    onClick={item.onClick ?? (() => {})}
                />
            ))}
        </Carousel>
    );
}