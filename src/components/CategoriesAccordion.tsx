import React, { useEffect, useRef, useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/system';

import CategoryList from './CategoryList';

const CustomAccordionSummary = styled(AccordionSummary)({
  margin: '0px',
  // padding: '8px 16px',
  padding: '0px',
});

const CustomAccordionDetails = styled(AccordionDetails)({
  // padding: '8px 16px', // Adjust the padding as needed
  margin: '0px',
  padding: '0px',
});

const CategoriesAccordion: React.FC = () => {
  const [maxWidth, setMaxWidth] = useState<number>(400);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.children;
      let maxWidth = 0;
      for (let i = 0; i < items.length; i++) {
        const itemWidth = (items[i] as HTMLElement).offsetWidth;
        if (itemWidth > maxWidth) {
          maxWidth = itemWidth;
        }
      }
      setMaxWidth(maxWidth);
    }
  }, []);

  /*
        <AccordionSummary expandIcon={<ArrowDropDownIcon />} id="panel2-header"
        sx={{ margin: 0, padding: '8px 16px' }}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '8px 16px' }}>
          <CategoryList />
        </AccordionDetails>
  */
  return (
    <Box sx={{ width: '100%', maxWidth: maxWidth, bgcolor: 'background.paper' }}>
      {/* <Accordion>
        <CustomAccordionSummary expandIcon={<ArrowDropDownIcon />} id="panel2-header">
          <Typography>Categories</Typography>
        </CustomAccordionSummary>
        <CustomAccordionDetails>
          <CategoryList />
        </CustomAccordionDetails>
      </Accordion> */}
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />} id="panel2-header"
        sx={{ margin: 0, padding: '0px 0px' }}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: 0, padding: '0px 0px' }}>
          <CategoryList />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CategoriesAccordion;
