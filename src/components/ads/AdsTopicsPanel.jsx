import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Chip, Divider, List, ListItemButton, ListItemText, Stack, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ChipsGroup({ title, items, max = 24 }) {
  if (!items || items.length === 0) return null;
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {items.slice(0, max).map((label, idx) => (
            <Chip key={`${label}-${idx}`} label={label} variant="outlined" size="small" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

ChipsGroup.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
  max: PropTypes.number,
};

function formatTime(ts) {
  if (!ts) return '-';
  try { return new Date(ts * 1000).toLocaleString(); } catch { return String(ts); }
}

export default function AdsTopicsPanel({ adsBusiness, topics, details }) {
  const [query, setQuery] = useState('');

  const advertisers = Array.isArray(adsBusiness?.advertisers) ? adsBusiness.advertisers : [];
  const filteredAdvertisers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return advertisers;
    return advertisers.filter((a) => a.toLowerCase().includes(q));
  }, [advertisers, query]);

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <ChipsGroup title="Your Topics" items={topics || []} />
      <ChipsGroup title="Ad Interests" items={adsBusiness?.adPreferences || []} />
      <ChipsGroup title="Other Categories Used To Reach You" items={adsBusiness?.otherCategories || []} />
      <ChipsGroup title="Ads About Meta" items={adsBusiness?.aboutMeta || []} />

      {(advertisers || []).length > 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Advertisers Using Your Activity/Info</Typography>
              <TextField
                size="small"
                placeholder="Search advertisers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
                  {filteredAdvertisers.slice(0, 100).map((name, idx) => (
                    <ListItemButton key={`${name}-${idx}`} divider>
                      <ListItemText primary={name} />
                    </ListItemButton>
                  ))}
                  {filteredAdvertisers.length === 0 && (
                    <ListItemButton divider>
                      <ListItemText primary="No advertisers match your search" />
                    </ListItemButton>
                  )}
                </List>
              </Box>
              <Divider />
              <Typography variant="caption" color="text.secondary">
                Showing {Math.min(filteredAdvertisers.length, 100)} of {filteredAdvertisers.length} advertisers
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Full data lists */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Ads viewed ({(details?.adsViewed || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.adsViewed || []).map((x, idx) => (
              <ListItemButton key={`av-${idx}`} divider component={x.href ? 'a' : 'div'} href={x.href || undefined} target={x.href ? '_blank' : undefined} rel={x.href ? 'noopener noreferrer' : undefined}>
                <ListItemText primary={x.title || 'Unknown'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Posts viewed ({(details?.postsViewed || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.postsViewed || []).map((x, idx) => (
              <ListItemButton key={`pv-${idx}`} divider component={x.href ? 'a' : 'div'} href={x.href || undefined} target={x.href ? '_blank' : undefined} rel={x.href ? 'noopener noreferrer' : undefined}>
                <ListItemText primary={x.title || 'Post'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Posts not interested ({(details?.postsNotInterested || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.postsNotInterested || []).map((x, idx) => (
              <ListItemButton key={`pni-${idx}`} divider component={x.href ? 'a' : 'div'} href={x.href || undefined} target={x.href ? '_blank' : undefined} rel={x.href ? 'noopener noreferrer' : undefined}>
                <ListItemText primary={x.title || 'Post marked not interested'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Profiles not interested ({(details?.profilesNotInterested || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.profilesNotInterested || []).map((x, idx) => (
              <ListItemButton key={`prni-${idx}`} divider component={x.href ? 'a' : 'div'} href={x.href || undefined} target={x.href ? '_blank' : undefined} rel={x.href ? 'noopener noreferrer' : undefined}>
                <ListItemText primary={x.title || 'Profile'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Suggested profiles viewed ({(details?.suggestedProfilesViewed || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.suggestedProfilesViewed || []).map((x, idx) => (
              <ListItemButton key={`spv-${idx}`} divider>
                <ListItemText primary={x.title || 'Profile'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Videos watched ({(details?.videosWatched || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.videosWatched || []).map((x, idx) => (
              <ListItemButton key={`vw-${idx}`} divider component={x.href ? 'a' : 'div'} href={x.href || undefined} target={x.href ? '_blank' : undefined} rel={x.href ? 'noopener noreferrer' : undefined}>
                <ListItemText primary={x.title || 'Video'} secondary={formatTime(x.timestamp)} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>In-app messages ({(details?.inAppMessages || []).length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense sx={{ maxHeight: 280, overflow: 'auto' }}>
            {(details?.inAppMessages || []).map((x, idx) => (
              <ListItemButton key={`iam-${idx}`} divider>
                <ListItemText primary={x.title} secondary={`${x.subtitle || ''}${x.subtitle ? ' • ' : ''}${x.count ?? 0}x`} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

AdsTopicsPanel.propTypes = {
  adsBusiness: PropTypes.shape({
    advertisers: PropTypes.arrayOf(PropTypes.string),
    otherCategories: PropTypes.arrayOf(PropTypes.string),
    adPreferences: PropTypes.arrayOf(PropTypes.string),
    aboutMeta: PropTypes.arrayOf(PropTypes.string),
  }),
  topics: PropTypes.arrayOf(PropTypes.string),
  details: PropTypes.shape({
    adsViewed: PropTypes.array,
    postsViewed: PropTypes.array,
    postsNotInterested: PropTypes.array,
    profilesNotInterested: PropTypes.array,
    suggestedProfilesViewed: PropTypes.array,
    videosWatched: PropTypes.array,
    inAppMessages: PropTypes.array,
  }),
};


