import styled from '@emotion/styled';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip arrow classes={{ popper: className }} placement="top" {...props} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0C111D',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#0C111D',
    color: 'primary.contrastText',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    padding: '8px 12px',
    lineHeight: '18px',
  },
}));

export default CustomTooltip;
