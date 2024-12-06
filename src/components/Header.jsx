import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Closeアイコンを使用
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      border={2}
      sx={{
        height: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#65D8FF",
        padding: "0 20px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <h1>Japow</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginLeft: 2 }}
        >
          雪質の種類
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" align="center">
            雪質の種類
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
            }}
          >
            {/* パウダースノー */}
            <Card>
              <CardHeader title="パウダースノー" />
              <CardContent>
                <Typography>
                  水分量が非常に少なく、降りたばかりのふわふわでサラサラな雪です。
                </Typography>
                <Typography>滑走時に軽快な感触が楽しめます。</Typography>
              </CardContent>
            </Card>
            {/* 乾雪 */}
            <Card>
              <CardHeader title="乾雪（かんせつ）" />
              <CardContent>
                <Typography>
                  水分量が少なく、さらさらした雪のことです。
                </Typography>
                <Typography>
                  滑走時にスピードが出やすく、カーブもしやすい特徴があります。
                </Typography>
              </CardContent>
            </Card>
            {/* 新雪 */}
            <Card>
              <CardHeader title="新雪（しんせつ）" />
              <CardContent>
                <Typography>新しく降り積もった雪を指します。</Typography>
                <Typography>
                  浮遊感を味わえますが、滑走にはやや難しく、初心者には扱いづらい場合もあります。
                </Typography>
              </CardContent>
            </Card>
            {/* 湿雪 */}
            <Card>
              <CardHeader title="湿雪（しっせつ）" />
              <CardContent>
                <Typography>
                  乾雪に比べて水分を多く含んでいる雪です。
                </Typography>
                <Typography>
                  スピードが出にくいですが、安定感があります。
                </Typography>
              </CardContent>
            </Card>
            {/* シャバ雪 */}
            <Card>
              <CardHeader title="シャバ雪" />
              <CardContent>
                <Typography>
                  水分量がかなり多く、べっとりとした質感の雪です。
                </Typography>
                <Typography>
                  スピードが出にくいため、低速での練習に適しています。
                </Typography>
              </CardContent>
            </Card>
            {/* アイスバーン */}
            <Card>
              <CardHeader title="アイスバーン" />
              <CardContent>
                <Typography>凍って硬くなった状態の雪を指します。</Typography>
                <Typography>
                  スピードが出やすいですが、カーブがしづらく、エッジをしっかり効かせる技術が必要です。エッジングの練習に適しています。
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
