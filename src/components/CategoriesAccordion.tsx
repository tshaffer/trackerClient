import React, { useEffect, useRef, useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import CategoryList from './CategoryList';

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

  return (
    <Box sx={{ width: '100%', maxWidth: maxWidth, bgcolor: 'background.paper' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />} id="panel2-header">
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CategoryList />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CategoriesAccordion;
